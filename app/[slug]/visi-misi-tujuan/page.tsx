import LayoutShell from "@/components/LayoutShell";
import PageHeader from "@/components/PageHeader";
import TableCard from "@/components/TableCard";
import { getVisiMisiTujuan, type VisiItem } from "@/db/queries/visi-misi-tujuan";
import { IconEye, IconPencil } from "@tabler/icons-react";
import VisiMisiTableClient, { TableRow } from "@/components/ui/VisiMisiTableClient";

function flattenRows(items: VisiItem[]): TableRow[] {
  return items.flatMap((visiItem) => {
    if (visiItem.misi.length === 0) {
      return [{
        id: `visi-${visiItem.id}`,
        visi: visiItem.visiText ?? "-",
        misi: "-",
        tujuan: "-",
      }];
    }

    return visiItem.misi.flatMap((misiItem) => {
      if (misiItem.tujuan.length === 0) {
        return [{
          id: `misi-${misiItem.id}`,
          visi: visiItem.visiText ?? "-",
          misi: misiItem.misiText ?? "-",
          tujuan: "-",
        }];
      }

      return misiItem.tujuan.map((tujuanItem) => ({
        id: `tujuan-${tujuanItem.id}`,
        visi: visiItem.visiText ?? "-",
        misi: misiItem.misiText ?? "-",
        tujuan: tujuanItem.tujuanText ?? "-",
      }));
    });
  });
}

export default async function VisiMisiPage() {
  let rows: TableRow[] = [];
  let errorMessage: string | null = null;
  try {
    const data = await getVisiMisiTujuan();
    rows = flattenRows(data);
  } catch (error: unknown) {
    errorMessage = error instanceof Error ? error.message : "Gagal memuat data visi, misi, dan tujuan.";
  }
  const VisiMisiTableClient = (await import("@/components/ui/VisiMisiTableClient")).default;
  return (
    <LayoutShell>
      <PageHeader
        title="Visi, Misi & Tujuan"
        description="Fondasi arah kebijakan dan landasan perencanaan strategis LAN RI."
      />
      <TableCard title="Daftar Visi, Misi, dan Tujuan">
        <VisiMisiTableClient rows={rows} errorMessage={errorMessage} />
      </TableCard>
    </LayoutShell>
  );
}
