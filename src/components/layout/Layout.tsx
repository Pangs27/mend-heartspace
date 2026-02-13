import { ReactNode} from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
  fullScreen?: boolean;
}



export function Layout({ children, hideFooter, fullScreen }: LayoutProps) {



  return (
    <div className={`${fullScreen ? "h-screen overflow-hidden" : "min-h-screen"} flex flex-col`}>

      <Navbar />
      <main className={`flex-1 pt-16 lg:pt-18 ${fullScreen ? "min-h-0 overflow-hidden" : ""}`}>
        {children}
      </main>
      {!hideFooter && <Footer />}


      
    </div>
  );
}
