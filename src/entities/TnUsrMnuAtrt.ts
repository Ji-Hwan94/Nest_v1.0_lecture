import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { TmMnuMst } from "./TmMnuMst";

@Index("FK_tm_mnu_mst_TO_tn_usr_mnu_atrt", ["mnuId"], {})
@Entity("tn_usr_mnu_atrt", { schema: "lms_one" })
export class TnUsrMnuAtrt {
  @Column("varchar", { primary: true, name: "user_type", length: 1 })
  userType: string;

  @Column("varchar", { primary: true, name: "MNU_ID", length: 5 })
  mnuId: string;

  @ManyToOne(() => TmMnuMst, (tmMnuMst) => tmMnuMst.tnUsrMnuAtrts, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "MNU_ID", referencedColumnName: "mnuId" }])
  mnu: TmMnuMst;
}
