"use client";

import UsersTable from "./components/UsersTable";

export default function UsersView() {
  return (
    <div className="pt-8">
      <div className="flex justify-between items-center p-4">
        <p className="text-xl pb-2">Usuarios</p>
      </div>
      <UsersTable />
    </div>
  );
}

