package com.nodepc.backend.backend.servlet;

import com.nodepc.backend.backend.model.User;
import com.nodepc.backend.backend.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.support.SpringBeanAutowiringSupport;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet("/admin-servlet/users")
public class UserServlet extends HttpServlet {
    @Autowired private UserService userService;

    @Override
    public void init() throws ServletException { SpringBeanAutowiringSupport.processInjectionBasedOnServletContext(this, getServletContext()); }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/html");
        PrintWriter out = resp.getWriter();

        List<User> users = userService.getAllUsers();

        out.println("<!DOCTYPE html>");
        out.println("<html lang='en'>");
        out.println("<head>");
        out.println("    <meta charset='UTF-8'>");
        out.println("    <meta name='viewport' content='width=device-width, initial-scale=1.0'>");
        out.println("    <title>NodePC Users</title>");
        out.println("    <style>");
        out.println("        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f4f4f4; }");
        out.println("        h1 { color: #333; text-align: center; }");
        out.println("        table { width: 100%; border-collapse: collapse; margin: 20px 0; background-color: white; box-shadow: 0 0 10px rgba(0,0,0,0.1); }");
        out.println("        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }");
        out.println("        th { background-color: #9C27B0; color: white; }");
        out.println("        tr:hover { background-color: #f5f5f5; }");
        out.println("        .role { font-weight: bold; }");
        out.println("        .role.ROLE_ADMIN { color: #e74c3c; }");
        out.println("        .role.ROLE_USER { color: #27ae60; }");
        out.println("        .container { max-width: 1200px; margin: 0 auto; }");
        out.println("    </style>");
        out.println("</head>");
        out.println("<body>");
        out.println("    <div class='container'>");
        out.println("        <h1>NodePC Users</h1>");
        out.println("        <table>");
        out.println("            <thead>");
        out.println("                <tr>");
        out.println("                    <th>ID</th>");
        out.println("                    <th>Username</th>");
        out.println("                    <th>Email</th>");
        out.println("                    <th>Role</th>");
        out.println("                </tr>");
        out.println("            </thead>");
        out.println("            <tbody>");

        for (User u : users) {
            out.println("                <tr>");
            out.println("                    <td>" + u.getId() + "</td>");
            out.println("                    <td>" + u.getUsername() + "</td>");
            out.println("                    <td>" + u.getEmail() + "</td>");
            out.println("                    <td class='role " + u.getRole() + "'>" + u.getRole() + "</td>");
            out.println("                </tr>");
        }

        out.println("            </tbody>");
        out.println("        </table>");
        out.println("    </div>");
        out.println("</body>");
        out.println("</html>");
    }
}
