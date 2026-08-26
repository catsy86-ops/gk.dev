import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Developer & Tech Recruiter Console Signature
if (typeof window !== "undefined" && process.env.NODE_ENV !== "test") {
  console.log(
    `%c
   ██████╗ ██╗  ██╗   ██████╗ ███████╗██╗   ██╗
  ██╔════╝ ██║ ██╔╝   ██╔══██╗██╔════╝██║   ██║
  ██║  ███╗█████═╝    ██║  ██║█████╗  ██║   ██║
  ██║   ██║██╔═██╗    ██║  ██║██╔══╝  ╚██╗ ██╔╝
  ╚██████╔╝██║ ╚██╗██╗██████╔╝███████╗ ╚████╔╝ 
   ╚═════╝ ╚═╝  ╚═╝╚═╝╚═════╝ ╚══════╝  ╚═══╝  
   
  🚀 Grzegorz — Mid Full-Stack Developer (Samouk) | Szczecin
  🌐 Portfolio: https://gkdev.pl | GitHub: https://github.com/catsy86
  ⚡ Hotkeys: [~] Terminal CLI | [M] Matrix Mode | [P] Dev Passport
`,
    "color: #10b981; font-family: monospace; font-weight: bold;"
  );
}

createRoot(document.getElementById("root")!).render(<App />);
