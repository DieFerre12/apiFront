package com.uade.tpo.demo.controllers.product;

import java.net.URI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.uade.tpo.demo.entity.Product;
import com.uade.tpo.demo.exceptions.InsufficientStockException;
import com.uade.tpo.demo.exceptions.InvalidPriceException;
import com.uade.tpo.demo.exceptions.InvalidProductDataException;
import com.uade.tpo.demo.service.product.ProductService;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired 
    private ProductService productService;

    @GetMapping
    public ResponseEntity<Page<Product>> getProducts(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        if (page == null || size == null)
            return ResponseEntity.ok(productService.getProducts(PageRequest.of(0, Integer.MAX_VALUE)));
        return ResponseEntity.ok(productService.getProducts(PageRequest.of(page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/new")
public ResponseEntity<Object> createProduct(@RequestBody ProductRequest productRequest)
        throws InvalidProductDataException, InvalidPriceException, InsufficientStockException {
    Product result = productService.createProduct(
        productRequest.getDescription(),
        productRequest.getModel(),
        productRequest.getGenre(),
        productRequest.getImage(),
        productRequest.getPrice(),
        productRequest.getStock(),
        productRequest.getCategoryType(),  // Pasar el CategoryType
        productRequest.getBrand(),
        productRequest.getSize()
    );
    return ResponseEntity.created(URI.create("/products/" + result.getId())).body(result);
}

}
