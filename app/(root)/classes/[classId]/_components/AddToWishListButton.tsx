import MyButton from "@/components/ui/MyButton";
import { useAddToWishListMutation } from "@/src/redux/api/student/wishlistApi";
import { Heart } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface WishListButtonProps {
  batch_id: number;
  batch_name: string;
}

const AddToWishListButton = ({ batch_id, batch_name }: WishListButtonProps) => {
  const [addToWishlist, { isLoading }] = useAddToWishListMutation();

  const addToWishlistHandler = async (id: number) => {
    try {
      await addToWishlist({ batch_id: id }).unwrap();
      toast.success(`${batch_name} Successfully added to wishlist!`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add to wishlist");
    }
  };

  return (
    <div className="p-6">
      <MyButton
        variant="primary"
        className="w-full gap-2"
        onClick={() => addToWishlistHandler(batch_id)}
        isLoading={isLoading}
      >
        <Heart className="w-4 h-4" />
        Add to wishlist
      </MyButton>
    </div>
  );
};

export default AddToWishListButton;
