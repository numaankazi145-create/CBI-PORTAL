import { MdOutlineLogout } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaEllipsisVertical } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function LogoutMenu() {
  const navigate = useNavigate();
  function LogoutHandle() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.error("Logged out successfully");
    navigate("/login");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <FaEllipsisVertical className="text-white" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-10" align="top">
        <DropdownMenuItem>
          <span
            onClick={LogoutHandle}
            className="flex items-center justify-between w-full px-1 hover:text-red-600"
          >
            <span className="text-[16px] font-bold">Log Out</span>
            <MdOutlineLogout className="text-xl font-bold" />
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
