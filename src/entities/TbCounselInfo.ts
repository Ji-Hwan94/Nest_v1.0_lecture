import { Column, Entity } from "typeorm";

@Entity("tb_counsel_info", { schema: "lms_one" })
export class TbCounselInfo {
  @Column("int", { name: "lec_id" })
  lecId: number;

  @Column("int", { primary: true, name: "counsel_Id" })
  counselId: number;

  @Column("varchar", { name: "counsel_title", nullable: true, length: 200 })
  counselTitle: string | null;

  @Column("varchar", { name: "counsel_content", nullable: true, length: 2000 })
  counselContent: string | null;

  @Column("varchar", { name: "counsel_location", nullable: true, length: 200 })
  counselLocation: string | null;

  @Column("datetime", { name: "counsel_reg_date", nullable: true })
  counselRegDate: Date | null;

  @Column("varchar", {
    name: "counsel_student_name",
    nullable: true,
    length: 10,
  })
  counselStudentName: string | null;
}
