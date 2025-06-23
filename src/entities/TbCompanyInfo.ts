import { Column, Entity } from "typeorm";

@Entity("tb_company_info", { schema: "lms_one" })
export class TbCompanyInfo {
  @Column("varchar", { primary: true, name: "company_id", length: 50 })
  companyId: string;

  @Column("varchar", { name: "company_name", length: 50 })
  companyName: string;

  @Column("varchar", { name: "company_ceo", length: 50 })
  companyCeo: string;

  @Column("varchar", { name: "company_hp", length: 50 })
  companyHp: string;

  @Column("varchar", { name: "company_loc", length: 100 })
  companyLoc: string;

  @Column("varchar", { name: "company_email", length: 50 })
  companyEmail: string;

  @Column("datetime", { name: "company_reg_date" })
  companyRegDate: Date;
}
