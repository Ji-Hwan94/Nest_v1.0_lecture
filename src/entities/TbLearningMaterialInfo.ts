import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { TbInstructorInfo } from "./TbInstructorInfo";
import { TbLectureInfo } from "./TbLectureInfo";

@Index("FK_tb_lecture_info_TO_tb_learning_material_info", ["lecId"], {})
@Index("FK_tb_instructor_info_TO_tb_learning_material_info", ["loginId"], {})
@Entity("tb_learning_material_info", { schema: "lms_one" })
export class TbLearningMaterialInfo {
  @Column("int", { primary: true, name: "materi_id" })
  materiId: number;

  @Column("int", { primary: true, name: "lec_id" })
  lecId: number;

  @Column("varchar", { primary: true, name: "loginID", length: 50 })
  loginId: string;

  @Column("blob", { name: "materi_material", nullable: true })
  materiMaterial: Buffer | null;

  @Column("varchar", { name: "materi_title", length: 50 })
  materiTitle: string;

  @Column("varchar", { name: "materi_content", length: 2000 })
  materiContent: string;

  @Column("date", { name: "materi_date" })
  materiDate: string;

  @Column("varchar", { name: "file_name", nullable: true, length: 50 })
  fileName: string | null;

  @Column("varchar", { name: "file_ext", nullable: true, length: 10 })
  fileExt: string | null;

  @Column("varchar", { name: "file_size", nullable: true, length: 10 })
  fileSize: string | null;

  @Column("varchar", { name: "physical_path", nullable: true, length: 100 })
  physicalPath: string | null;

  @Column("varchar", { name: "logical_path", nullable: true, length: 100 })
  logicalPath: string | null;

  @ManyToOne(
    () => TbInstructorInfo,
    (tbInstructorInfo) => tbInstructorInfo.tbLearningMaterialInfos,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "loginID", referencedColumnName: "loginId" }])
  login: TbInstructorInfo;

  @ManyToOne(
    () => TbLectureInfo,
    (tbLectureInfo) => tbLectureInfo.tbLearningMaterialInfos,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "lec_id", referencedColumnName: "lecId" }])
  lec: TbLectureInfo;
}
