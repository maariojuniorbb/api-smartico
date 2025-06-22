import pool from '../config/db';

export interface JogadorPreferencia {
  jogador_codigo: number;
  top_win_1: string | null;
  top_win_2: string | null;
  top_win_3: string | null;
  top_win_provider: string | null;
  top_amount_1: string | null;
  top_amount_2: string | null;
  top_amount_3: string | null;
  top_amount_provider: string | null;
  top_spin_1: string | null;
  top_spin_2: string | null;
  top_spin_3: string | null;
  top_spin_provider: string | null;
}

export interface NiveisFraude {
  codigo: number;
  nivel: number;
}

export async function getAllPreferencias(): Promise<JogadorPreferencia[]> {
  const { rows } = await pool.query<JogadorPreferencia>('SELECT * FROM mv_jogadores_preferencias;');
  return rows;
}

export async function getAllNiveisFraude(): Promise<NiveisFraude[]> {
  const { rows } = await pool.query<NiveisFraude>('SELECT codigo, nivel FROM mv_jogadores_niveis limit 200;');
  return rows;
}

export async function updateViewPreferencies(): Promise<any> {
  const { rows } = await pool.query<JogadorPreferencia>('REFRESH MATERIALIZED VIEW mv_jogadores_preferencias;');
  return rows;
}

export async function updateViewNiveisFraude(): Promise<any> {
  const { rows } = await pool.query<JogadorPreferencia>('REFRESH MATERIALIZED VIEW mv_jogadores_niveis;');
  return rows;
}
