import { Link, useLocation } from "react-router-dom";
import { FaEllipsisVertical } from "react-icons/fa6";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  useSidebar,
} from "../ui/sidebar";
import { LogoutMenu } from "./LogoutMenu";

export function SideMenu({ sidemenuIcon1, sidemenuName1 }) {
  const location = useLocation();
  const isOverview = location.pathname === "/Landing";

  const user = JSON.parse(localStorage.getItem("user") || "null");

  function AppSidebar() {
    const { open } = useSidebar();

    return (
      <Sidebar collapsible="icon">
        <SidebarHeader
          className={`flex items-center gap-2 ${
            open ? "pt-6 pb-9 px-3" : "py-6 px-1"
          }`}
        >
          <img
            src="icons/Heading.png"
            alt="Sidebar logo"
            className={`transition-all duration-300 ${
              open ? "h-20 w-60 m-auto" : "h-3 w-full"
            }`}
          />
        </SidebarHeader>

        {/* User Profile */}
        <div className={open ? "flex justify-between items-center" : ""}>
          <div className={open ? "flex items-center gap-4" : ""}>
            <img
              src="images/Avatar.jpg"
              alt="User Avatar"
              className={`rounded-full transition-all duration-300 ${
                open ? "h-13 w-13" : "h-8 w-8 "
              }`}
            />
            {open && (
              <div className="flex flex-col">
                <span className="text-[#FDFDFD] font-semibold text-base leading-6">
                  {user?.name}
                </span>
                <p className="text-[#F5F5F5] font-normal text-base leading-6">
                  {user?.role}
                </p>
              </div>
            )}
          </div>
          {open ? <LogoutMenu /> : null}
        </div>

        <SidebarContent>
          <SidebarGroup>
            <hr className="border-t border-white my-5" />
            <SidebarGroupLabel className="text-white font-medium text-base leading-5">
              Main Menu
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={`text-white  ${
                      isOverview
                        ? "bg-[#ffffff6b] hover:bg-[#ffffff93]"
                        : "hover:bg-[#ffffff26]"
                    }`}
                  >
                    <Link to="/Landing" className="flex items-center gap-2">
                      <img
                        src={`/icons/${sidemenuIcon1}`}
                        alt={sidemenuName1}
                        className={`${open ? "h-6 w-6" : "h-4 w-4"}`}
                      />
                      {open && (
                        <span className="font-medium text-base leading-6 text-white">
                          {sidemenuName1}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Sidebar Rail — enables hover expand effect */}
        <SidebarRail />
      </Sidebar>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
    </SidebarProvider>
  );
}
