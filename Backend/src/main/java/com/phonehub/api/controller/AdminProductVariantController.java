package com.phonehub.api.controller;

import com.phonehub.api.model.Image;
import com.phonehub.api.model.Product;
import com.phonehub.api.model.ProductVariant;
import com.phonehub.api.repository.ProductRepository;
import com.phonehub.api.repository.ProductVariantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/products")
public class AdminProductVariantController {

    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Autowired
    private ProductRepository productRepository;

    // Get all variants for a product
    @GetMapping("/{productId}/variants")
    public ResponseEntity<List<ProductVariant>> getVariantsByProduct(@PathVariable Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return ResponseEntity.ok(product.getProductVariants());
    }

    // Add a new variant
    @PostMapping("/{productId}/variants")
    public ResponseEntity<ProductVariant> createVariant(@PathVariable Long productId, @RequestBody ProductVariant variant) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        variant.setProduct(product);
        variant.setCreatedAt(new Date());
        
        if (variant.getImages() != null) {
            for (Image img : variant.getImages()) {
                img.setProductVariant(variant);
                img.setCreatedAt(new Date());
            }
        }
        
        return ResponseEntity.ok(productVariantRepository.save(variant));
    }

    // Update a variant
    @PutMapping("/variants/{variantId}")
    public ResponseEntity<ProductVariant> updateVariant(@PathVariable Long variantId, @RequestBody ProductVariant variantDetails) {
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Variant not found"));
        
        variant.setSku(variantDetails.getSku());
        variant.setPrice(variantDetails.getPrice());
        variant.setStockQuantity(variantDetails.getStockQuantity());
        variant.setColor(variantDetails.getColor());
        variant.setCapacity(variantDetails.getCapacity());
        variant.setRam(variantDetails.getRam());
        variant.setOldPrice(variantDetails.getOldPrice());
        variant.setStatus(variantDetails.getStatus());
        
        if (variantDetails.getImages() != null && !variantDetails.getImages().isEmpty()) {
            variant.getImages().clear();
            for (Image img : variantDetails.getImages()) {
                img.setProductVariant(variant);
                img.setCreatedAt(new Date());
                variant.getImages().add(img);
            }
        } else if (variantDetails.getImages() != null && variantDetails.getImages().isEmpty()) {
            variant.getImages().clear();
        }
        
        return ResponseEntity.ok(productVariantRepository.save(variant));
    }

    // Delete a variant
    @DeleteMapping("/variants/{variantId}")
    public ResponseEntity<?> deleteVariant(@PathVariable Long variantId) {
        if (!productVariantRepository.existsById(variantId)) {
            return ResponseEntity.notFound().build();
        }
        productVariantRepository.deleteById(variantId);
        return ResponseEntity.ok().build();
    }
}
