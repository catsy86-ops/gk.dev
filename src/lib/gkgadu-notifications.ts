/**
 * GKgadu 2026 Web Notifications & Haptic Alert Engine
 * Handles browser desktop/mobile push notifications with permission handling.
 */

import { soundEngine } from "@/lib/audio";
import { hapticMedium, hapticSuccess } from "@/lib/haptics";

export interface GgNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  onClick?: () => void;
}

class GgNotificationService {
  private hasPermission = false;

  constructor() {
    if (typeof window !== "undefined" && "Notification" in window) {
      this.hasPermission = Notification.permission === "granted";
    }
  }

  public isSupported(): boolean {
    return typeof window !== "undefined" && "Notification" in window;
  }

  public getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) return "denied";
    return Notification.permission;
  }

  public async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;
    try {
      const permission = await Notification.requestPermission();
      this.hasPermission = permission === "granted";
      if (this.hasPermission) {
        hapticSuccess();
        this.showNotification({
          title: "☀️ GKgadu 2026 Powiadomienia Włączone!",
          body: "Będziesz otrzymywać powiadomienia o nowych wiadomościach na żywo.",
        });
      }
      return this.hasPermission;
    } catch {
      return false;
    }
  }

  public showNotification(options: GgNotificationOptions): void {
    // 1. Play native GKgadu sound & haptics
    soundEngine.playGgMessage();
    hapticMedium();

    // 2. Check if desktop notifications are permitted and window is hidden/blurred
    if (
      this.isSupported() &&
      Notification.permission === "granted" &&
      typeof document !== "undefined" &&
      document.hidden
    ) {
      try {
        const notif = new Notification(options.title, {
          body: options.body,
          icon: options.icon || "/favicon.ico",
          tag: options.tag || "gkgadu-msg",
          badge: "/favicon.ico",
          silent: true, // We already played Web Audio soundEngine
        });

        notif.onclick = () => {
          window.focus();
          if (options.onClick) {
            options.onClick();
          }
          notif.close();
        };
      } catch {
        // Ignore notification errors in restricted contexts
      }
    }
  }
}

export const ggNotificationService = new GgNotificationService();
