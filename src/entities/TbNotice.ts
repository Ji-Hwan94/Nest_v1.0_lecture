import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { TbUserinfo } from "./TbUserinfo";

@Index("FK_tb_userinfo_TO_tb_notice", ["loginId"], {})
@Entity("tb_notice", { schema: "lms_one" })
export class TbNotice {
  @Column("int", { primary: true, name: "notice_id" })
  noticeId: number;

  @Column("varchar", { primary: true, name: "loginID", length: 50 })
  loginId: string;

  @Column("varchar", { name: "notice_title", length: 50 })
  noticeTitle: string;

  @Column("varchar", { name: "notice_content", length: 1000 })
  noticeContent: string;

  @Column("datetime", { name: "notice_reg_date" })
  noticeRegDate: Date;

  @Column("datetime", { name: "notice_update_date", nullable: true })
  noticeUpdateDate: Date | null;

  @Column("varchar", { name: "file_name", nullable: true, length: 100 })
  fileName: string | null;

  @Column("varchar", { name: "file_ext", nullable: true, length: 10 })
  fileExt: string | null;

  @Column("int", { name: "file_size", nullable: true })
  fileSize: number | null;

  @Column("varchar", { name: "physical_path", nullable: true, length: 100 })
  physicalPath: string | null;

  @Column("varchar", { name: "logical_path", nullable: true, length: 100 })
  logicalPath: string | null;

  @ManyToOne(() => TbUserinfo, (tbUserinfo) => tbUserinfo.tbNotices, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "loginID", referencedColumnName: "loginId" }])
  login: TbUserinfo;
}
