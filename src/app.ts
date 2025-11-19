import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { specs } from "@/docs/swagger";
import { ENV } from "@/config/env";

// Routes
// import userRoutes from "@/routes/user.routes";
// import monitoringRoutes from "@/routes/monitoring.routes";


// import { loggingMiddleware } from "@/middleware/loggingMiddleware";
// import { metricsMiddleware } from "@/middleware/monitoringMiddleware";
// import { setupSecurityHeaders } from "@/middleware/securityHeaders";
// import { apiLimiter, authLimiter } from "@/middleware/rateLimiter";
// import { cache } from "@/middleware/cacheMiddleware";

// import { ErrorMonitoringService } from "@/services/errorMonitoring.service.js";
import { notFoundHandler } from "./middleware/notFound";
import { compressionMiddleware } from "./middleware/performanceMiddleware";
import { errorHandler } from "./middleware/errorHandler";
import { requestId } from "./middleware/requestId";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import path from "path";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import categoryRoutes from "./routes/category.routes";
import blogRoutes from "./routes/blog.routes";
import paymentRoutes from "./routes/payment.routes";
const app = express();

// Initialize error monitoring
// ErrorMonitoringService.getInstance();

// --- Middleware Setup ---
app.use(requestId);
// setupSecurityHeaders(app);
app.use(cors({ origin: ENV.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(compressionMiddleware);
// app.use(loggingMiddleware);
// app.use(metricsMiddleware);

// --- Rate Limiting ---
// app.use("/api/auth", authLimiter);
// app.use("/api", apiLimiter);

app.get("/", (req, res) => res.json({ message: "Veloura Backend Running!" }));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
  });
});



app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/blog", blogRoutes);
// payment routes

app.use("/api/payments", paymentRoutes);
// app.use("/api/monitoring", monitoringRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const swaggerOptions = {
  explorer: true,
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: "none",
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true,
  },
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Veloura API Docs",
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));
// Raw OpenAPI JSON (for swagger-typescript-api codegen)
app.get("/v3/api-docs", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(specs);
});

app.use(notFoundHandler);

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  return errorHandler(err, req, res, next);
};
app.use(errorMiddleware);

export default app;
