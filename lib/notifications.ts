/**
 * Notificaciones push del navegador (Web Notifications API).
 *
 * Funcionan en desktop y en el celular SIEMPRE que Neto esté abierto en el
 * navegador o instalado como PWA (ver public/manifest.json).
 *
 * TODO(celular nativo): para notificaciones nativas al teléfono aunque la app
 * esté cerrada (WhatsApp / SMS), integrar Twilio o la API de WhatsApp Business.
 * Eso requiere backend + número verificado y queda fuera del alcance actual.
 */

export type PermissionState = NotificationPermission | "unsupported";

/** ¿El navegador soporta la API de notificaciones? */
export function notificationsSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

/** Estado actual del permiso ("granted" | "denied" | "default" | "unsupported"). */
export function getNotificationPermission(): PermissionState {
  if (!notificationsSupported()) return "unsupported";
  return Notification.permission;
}

/** Pide permiso al usuario para mostrar notificaciones. */
export async function requestNotificationPermission(): Promise<PermissionState> {
  if (!notificationsSupported()) return "unsupported";
  try {
    return await Notification.requestPermission();
  } catch {
    return "denied";
  }
}

/**
 * Muestra una notificación push del navegador.
 * Devuelve true si se mostró, false si no se pudo (sin soporte o sin permiso).
 */
export function sendNotification(title: string, body: string): boolean {
  if (!notificationsSupported() || Notification.permission !== "granted") return false;
  try {
    new Notification(title, {
      body,
      icon: "/favicon.svg",
      badge: "/favicon.svg",
      tag: "neto-presupuesto", // reemplaza notificaciones previas en vez de apilar
    });
    return true;
  } catch {
    return false;
  }
}
