"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useConfirmModal } from "@/hooks/use-confirm-modal";

export const ConfirmModal = () => {
  const {
    isOpen,
    onClose,
    title,
    description,
    onConfirm,
    isLoading,
    setLoading,
  } = useConfirmModal();

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm(); // Chạy hàm xóa được truyền vào
      onClose(); // Đóng modal sau khi xong
    } catch (error) {
      console.error(error);
      // Có thể không đóng modal nếu lỗi, hoặc toast lỗi ở đây
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault(); // Chặn đóng mặc định để xử lý async
              handleConfirm();
            }}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading ? "Deleting..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
