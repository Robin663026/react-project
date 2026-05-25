import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ROLE_PRESETS, type HomeRolePreset, type SectorKey } from "@/lib/home/config";

interface Ctx {
  roleKey: string;
  setRoleKey: (k: string) => void;
  role: HomeRolePreset;
  sector: SectorKey;
  setSector: (s: SectorKey) => void;
}

const HomeRoleContext = createContext<Ctx | null>(null);

export function HomeRoleProvider({ children }: { children: ReactNode }) {
  const [roleKey, setRoleKey] = useState<string>(ROLE_PRESETS[0].key);
  const role = useMemo(
    () => ROLE_PRESETS.find((r) => r.key === roleKey) ?? ROLE_PRESETS[0],
    [roleKey],
  );
  const [sector, setSector] = useState<SectorKey>(role.defaultSector);

  // 切换角色时同步默认板块
  useEffect(() => {
    setSector(role.defaultSector);
  }, [role.defaultSector]);

  return (
    <HomeRoleContext.Provider value={{ roleKey, setRoleKey, role, sector, setSector }}>
      {children}
    </HomeRoleContext.Provider>
  );
}

export function useHomeRole() {
  const ctx = useContext(HomeRoleContext);
  if (!ctx) throw new Error("useHomeRole must be used within HomeRoleProvider");
  return ctx;
}
