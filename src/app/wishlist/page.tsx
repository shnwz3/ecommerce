import { redirect } from "next/navigation";

export default function WishlistPage() {
  redirect("/collections/all?wishlist=true");
}
