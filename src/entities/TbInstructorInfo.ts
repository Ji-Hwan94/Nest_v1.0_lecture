import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { TbUserinfo } from "./TbUserinfo";
import { TbLearningMaterialInfo } from "./TbLearningMaterialInfo";

@Entity("tb_instructor_info", { schema: "lms_one" })
export class TbInstructorInfo {
  @Column("varchar", { primary: true, name: "loginID", length: 50 })
  loginId: string;

  @Column("int", { name: "ins_num" })
  insNum: number;

  @Column("varchar", { name: "ins_account", nullable: true, length: 20 })
  insAccount: string | null;

  @Column("varchar", { name: "ins_bank", nullable: true, length: 50 })
  insBank: string | null;

  @OneToOne(() => TbUserinfo, (tbUserinfo) => tbUserinfo.tbInstructorInfo, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "loginID", referencedColumnName: "loginId" }])
  login: TbUserinfo;

  @OneToMany(
    () => TbLearningMaterialInfo,
    (tbLearningMaterialInfo) => tbLearningMaterialInfo.login
  )
  tbLearningMaterialInfos: TbLearningMaterialInfo[];
}
