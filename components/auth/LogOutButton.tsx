import React from "react";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { SpinnerCustom } from "../ui/spinner";

const LogOutButton = () => {
  const { user, isLoading, logout } = useAuth();
  return (
    <>
      {isLoading ? (
        <Button>
          <SpinnerCustom />
        </Button>
      ) : user ? (
        <Button
          onClick={() => logout()}
          variant="outline"
          className=" mx-auto mb-4 w-full"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sign Out</span>
        </Button>
      ) : (
        <></>
      )}
    </>
  );
};

export default LogOutButton;
