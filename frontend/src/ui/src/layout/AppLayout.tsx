/**
 * ============================================================
 * CHE·NU — UI DASHBOARD — APP LAYOUT
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React from "react";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import type { RootSphere } from "../adapters/universeAdapter";

interface AppLayoutProps {
  children: React.ReactNode;
  currentSphere?: RootSphere;
  onSphereChange?: (sphere: RootSphere) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  currentSphere,
  onSphereChange 
}) => {
  return (
    <div style={styles.container}>
      <Sidebar 
        currentSphere={currentSphere} 
        onSphereSelect={onSphereChange} 
      />
      <div style={styles.main}>
        <TopBar currentSphere={currentSphere} />
        <main style={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    backgroundColor: "#F5F5F5",
    color: "#1E1F22"
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },
  content: {
    flex: 1,
    padding: "24px",
    overflowY: "auto",
    backgroundColor: "#FAFAFA"
  }
};

export default AppLayout;
