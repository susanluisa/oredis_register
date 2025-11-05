import { create } from "zustand";

type DrawerStore = {
  isOpen: boolean
  selectedId: number | null
  openDrawer: (id: number) => void
  closeDrawer: () => void
}

export const useDrawerStore = create<DrawerStore>((set) => ({
  isOpen: false,
  selectedId: null,
  openDrawer: (id) => set({ isOpen: true, selectedId: id }),
  closeDrawer: () => set({ isOpen: false, selectedId: null }),
}))
