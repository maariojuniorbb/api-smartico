import pool from '../config/db';
import databricksRepository from './DatabricksRepository';

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
  const query = 'SELECT * FROM mv_jogadores_preferencias';
  const results = await databricksRepository.executeQuery(query);
  return results as JogadorPreferencia[];
}

export async function getAllNiveisFraude(): Promise<NiveisFraude[]> {
  const query = `
    WITH users AS (
        SELECT
            id AS user_id,
            name
        FROM silver.tb_users
    ),
    transactions AS (
        SELECT 
            user_id,
            SUM(amount) FILTER (WHERE src = 'deposit_charge') / 100 AS total_deposits,
            SUM(amount) FILTER (WHERE src = 'player_withdraw') / 100 AS total_withdrawals,
            SUM(amount) FILTER (WHERE type = 'debit' AND src = 'casino_transaction') / 100 AS turnover,
            SUM(amount) FILTER (WHERE type = 'credit' AND src = 'casino_transaction') / 100 AS win_amount,
            SUM(amount) FILTER (WHERE type = 'credit' AND src = 'casino_transaction_rollback') / 100 AS total_rollback_credit
        FROM silver.tb_transactions
        WHERE status = 'approved'
        GROUP BY 1
    )
    SELECT
          u.user_id                                         AS codigo,
          LOWER(u.name)                                     AS nome_completo,
          t.turnover                                        AS total_bet,
          t.total_rollback_credit                           AS total_rollback,
          t.turnover - COALESCE(t.total_rollback_credit, 0) AS total_jogado_ajustado,
          t.total_deposits,
          ROUND(
              try_divide(
                  t.turnover - COALESCE(t.total_rollback_credit, 0),
                  t.total_deposits
              ),
          4
          ) AS percent_jogado_sobre_depositado,
          CASE 
              WHEN t.total_deposits = 0 THEN NULL
              WHEN ((t.turnover - COALESCE(t.total_rollback_credit, 0)) / t.total_deposits) <= 0.15 THEN 5
              WHEN ((t.turnover - COALESCE(t.total_rollback_credit, 0)) / t.total_deposits) <= 0.25 THEN 4
              WHEN ((t.turnover - COALESCE(t.total_rollback_credit, 0)) / t.total_deposits) <= 0.45 THEN 3
              WHEN ((t.turnover - COALESCE(t.total_rollback_credit, 0)) / t.total_deposits) <= 0.60 THEN 2
              WHEN ((t.turnover - COALESCE(t.total_rollback_credit, 0)) / t.total_deposits) <= 0.80 THEN 1
              ELSE 0
          END AS nivel
    FROM users u
    INNER JOIN transactions t ON u.user_id = t.user_id;
    `;

  const results = await databricksRepository.executeQuery(query);
  return results as NiveisFraude[];
}
