import type { Metadata } from "next";
import { BookRedirect } from "./BookRedirect";

export const metadata: Metadata = {
  title: "預約",
  description: "預約一次徒手呼吸調整。一對一、安靜、慢。",
};

export default function BookPage() {
  return <BookRedirect />;
}
