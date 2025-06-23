import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { TbInstructorInfo } from './TbInstructorInfo';
import { TbLectureInfo } from './TbLectureInfo';
import { TbNotice } from './TbNotice';
import { TbQnaInfo } from './TbQnaInfo';
import { TbStudentsInfo } from './TbStudentsInfo';

@Entity('tb_userinfo', { schema: 'lms_one' })
export class TbUserinfo {
  @Column('varchar', { primary: true, name: 'loginID', length: 50 })
  loginId: string;

  @Column('varchar', { name: 'email', length: 100 })
  email: string | null;

  @Column('varchar', { name: 'class', nullable: true, length: 15 })
  class: string | null;

  @Column('varchar', { name: 'status_yn', nullable: true, length: 1 })
  statusYn: string | null;

  @Column('varchar', { name: 'hp', nullable: true, length: 15 })
  hp: string | null;

  @Column('varchar', { name: 'password', length: 100 })
  password: string | null;

  @Column('varchar', { name: 'name', length: 20 })
  name: string | null;

  @Column('varchar', { name: 'sex', nullable: true, length: 10 })
  sex: string | null;

  @Column('varchar', { name: 'loc', nullable: true, length: 20 })
  loc: string | null;

  @Column('varchar', { name: 'user_type', length: 1 })
  userType: string;

  @Column('varchar', { name: 'birthday', nullable: true, length: 15 })
  birthday: string | null;

  @Column('varchar', { name: 'regdate', nullable: true, length: 30 })
  regdate: string | null;

  @Column('varchar', { name: 'section', nullable: true, length: 10 })
  section: string | null;

  @OneToOne(
    () => TbInstructorInfo,
    (tbInstructorInfo) => tbInstructorInfo.login,
  )
  tbInstructorInfo: TbInstructorInfo;

  @OneToMany(() => TbLectureInfo, (tbLectureInfo) => tbLectureInfo.login)
  tbLectureInfos: TbLectureInfo[];

  @OneToMany(() => TbNotice, (tbNotice) => tbNotice.login)
  tbNotices: TbNotice[];

  @OneToMany(() => TbQnaInfo, (tbQnaInfo) => tbQnaInfo.login)
  tbQnaInfos: TbQnaInfo[];

  @OneToOne(() => TbStudentsInfo, (tbStudentsInfo) => tbStudentsInfo.login)
  tbStudentsInfo: TbStudentsInfo;
}
