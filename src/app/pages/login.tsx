import { useState } from "react";
import { useNavigate } from "react-router";
import { Shield } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Shield className="w-12 h-12 text-primary-foreground" />
          </div>
          <h1 className="text-3xl text-primary">EtxeSafe</h1>
          <p className="text-muted-foreground mt-1">Protege tu hogar</p>
        </div>

        {/* Login Form */}
        <div className="bg-card rounded-2xl shadow-lg p-6 border border-border">
          <h2 className="text-2xl mb-6 text-center">Bienvenid@</h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tunombre@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <Button type="submit" className="w-full h-12 mt-6">
              Iniciar Sesión
            </Button>
          </form>

          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-primary hover:underline">
              Recuperar contraseña
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Protected by 256-bit SSL encryption
        </p>
      </div>
    </div>
  );
}
