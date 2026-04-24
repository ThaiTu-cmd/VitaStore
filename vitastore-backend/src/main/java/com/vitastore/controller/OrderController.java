package com.vitastore.controller;

import com.vitastore.dto.OrderRequest;
import com.vitastore.entity.Order;
import com.vitastore.entity.OrderItem;
import com.vitastore.entity.User;
import com.vitastore.repository.OrderRepository;
import com.vitastore.repository.ProductRepository;
import com.vitastore.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderController(OrderRepository orderRepository,
            ProductRepository productRepository,
            UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    /** Admin: get all orders */
    @GetMapping
    public List<Order> getAll() {
        return orderRepository.findAll();
    }

    /** User: get own orders */
    @GetMapping("/my")
    public List<Order> getMine(@AuthenticationPrincipal User user) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getById(@PathVariable Long id) {
        return orderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Order> create(@RequestBody OrderRequest req,
            @AuthenticationPrincipal User principal) {
        Order order = new Order();

        // Resolve user — from JWT principal or from request body userId (fallback)
        User user = principal != null ? principal
                : userRepository.findById(req.userId()).orElse(null);
        order.setUser(user);
        order.setTotal(req.total());
        order.setNote(req.note());

        for (OrderRequest.ItemDto item : req.items()) {
            productRepository.findById(item.productId()).ifPresent(product -> {
                OrderItem oi = new OrderItem();
                oi.setOrder(order);
                oi.setProduct(product);
                oi.setQuantity(item.quantity());
                oi.setPrice(item.price());
                order.getItems().add(oi);
            });
        }

        return ResponseEntity.ok(orderRepository.save(order));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> update(@PathVariable Long id, @RequestBody Order body) {
        return orderRepository.findById(id)
                .map(o -> {
                    o.setStatus(body.getStatus());
                    o.setNote(body.getNote());
                    return ResponseEntity.ok(orderRepository.save(o));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!orderRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        orderRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
