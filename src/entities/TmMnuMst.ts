import { Column, Entity, OneToMany } from 'typeorm';
import { TnUsrMnuAtrt } from './TnUsrMnuAtrt';

@Entity('tm_mnu_mst', { schema: 'lms_one' })
export class TmMnuMst {
  @Column('varchar', { primary: true, name: 'MNU_ID', length: 5 })
  mnuId: string;

  @Column('varchar', { name: 'HIR_MNU_ID', length: 5 })
  hirMnuId: string;

  @Column('varchar', { name: 'MNU_NM', length: 100 })
  mnuNm: string | null;

  @Column('varchar', { name: 'MNU_URL', nullable: true, length: 500 })
  mnuUrl: string | null;

  @Column('varchar', { name: 'MNU_DVS_COD', length: 1 })
  mnuDvsCod: string | null;

  @Column('int', { name: 'GRP_NUM', nullable: true })
  grpNum: number | null;

  @Column('int', { name: 'ODR', nullable: true })
  odr: number | null;

  @Column('smallint', { name: 'LVL', nullable: true })
  lvl: number | null;

  @Column('varchar', { name: 'MNU_ICO_COD', nullable: true, length: 7 })
  mnuIcoCod: string | null;

  @Column('varchar', { name: 'USE_POA', nullable: true, length: 1 })
  usePoa: string | null;

  @Column('varchar', { name: 'DLT_POA', nullable: true, length: 1 })
  dltPoa: string | null;

  @OneToMany(() => TnUsrMnuAtrt, (tnUsrMnuAtrt) => tnUsrMnuAtrt.mnu)
  tnUsrMnuAtrts: TnUsrMnuAtrt[];
}
