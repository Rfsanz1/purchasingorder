import { Capacitor } from "@capacitor/core";

export const isNative = Capacitor.isNativePlatform();
export const platform = Capacitor.getPlatform();

export async function takePhoto(): Promise<string | null> {
  if (!isNative) {
    return null;
  }
  const { Camera, CameraResultType, CameraSource } = await import("@capacitor/camera");
  const photo = await Camera.getPhoto({
    quality: 80,
    allowEditing: false,
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Camera,
    saveToGallery: false,
  });
  return photo.dataUrl ?? null;
}

export async function pickPhoto(): Promise<string | null> {
  if (!isNative) {
    return null;
  }
  const { Camera, CameraResultType, CameraSource } = await import("@capacitor/camera");
  const photo = await Camera.getPhoto({
    quality: 80,
    allowEditing: false,
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Photos,
  });
  return photo.dataUrl ?? null;
}

export async function scanQrCode(): Promise<string | null> {
  if (!isNative) {
    return null;
  }
  const { BarcodeScanner } = await import("@capacitor-mlkit/barcode-scanning");
  const supported = await BarcodeScanner.isSupported();
  if (!supported.supported) return null;
  const perm = await BarcodeScanner.requestPermissions();
  if (perm.camera !== "granted" && perm.camera !== "limited") return null;
  const { barcodes } = await BarcodeScanner.scan();
  return barcodes[0]?.rawValue ?? null;
}

export async function initPushNotifications(
  onToken?: (token: string) => void,
  onMessage?: (payload: unknown) => void,
): Promise<void> {
  if (!isNative) return;
  const { PushNotifications } = await import("@capacitor/push-notifications");
  const perm = await PushNotifications.requestPermissions();
  if (perm.receive !== "granted") return;
  await PushNotifications.register();
  PushNotifications.addListener("registration", (t) => onToken?.(t.value));
  PushNotifications.addListener("pushNotificationReceived", (n) => onMessage?.(n));
  PushNotifications.addListener("pushNotificationActionPerformed", (n) => onMessage?.(n));
}
