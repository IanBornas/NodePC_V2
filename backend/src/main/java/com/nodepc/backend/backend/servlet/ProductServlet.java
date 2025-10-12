package com.nodepc.backend.backend.servlet;

import com.nodepc.backend.backend.DTO.ProductResponse;
import com.nodepc.backend.backend.service.ProductService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.support.SpringBeanAutowiringSupport;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet("/admin-servlet/products")
public class ProductServlet extends HttpServlet {

    @Autowired private ProductService productService;

    @Override
    public void init() throws ServletException {
        SpringBeanAutowiringSupport.processInjectionBasedOnServletContext(this, getServletContext());
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        resp.setContentType("text/plain");
        PrintWriter out = resp.getWriter();

        List<ProductResponse> products = productService.getAllProducts();

        out.println("==== NodePC Products ====");
        for (ProductResponse p : products) {
            out.println("ID: " + p.getId() + " | Name: " + p.getName() + " | Price: ₱" + p.getPrice());
        }
    }
}
