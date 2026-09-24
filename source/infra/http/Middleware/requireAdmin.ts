export default function requireAdmin(req: any, res: any, next: any) {
    if (req.userRole !== "admin") {
        return res.status(403).json({ message: "Acesso negado" });
    }
    return next();
}