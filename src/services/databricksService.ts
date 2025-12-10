import databricksRepository, { DatabricksRepository } from '../repositories/DatabricksRepository';
import logger from '../config/logger';

export class DatabricksService {
  private databricksRepository: DatabricksRepository;

  constructor(repository: DatabricksRepository = databricksRepository) {
    this.databricksRepository = repository;
  }

  async executarQueryTeste(): Promise<any[]> {
    try {
      logger.info('Executando query de teste no Databricks');
      
      const query = "SELECT * FROM apostatudobetbr.silver.tb_users LIMIT 10";
      
      const results = await this.databricksRepository.executeQuery(query);
      return results;
    } catch (error: any) {
      logger.error('Erro ao executar query de teste', { 
        error: error.message,
        stack: error.stack,
        name: error.name
      });
      throw error;
    }
  }

  async testarPreferencias(): Promise<any[]> {
    try {
      logger.info('Testando query de preferências no Databricks');
      
      const query = `
        WITH stats AS (
            SELECT 
                ct.user_id AS jogador_codigo,
                g.name AS jogo,
                ct.provider AS provedor,
                SUM(ct.amount) FILTER (WHERE type = 'result') AS sum_result,
                SUM(ct.amount) FILTER (WHERE type = 'bet') AS sum_bet,
                COUNT(ct.id) FILTER (WHERE type = 'bet') AS count_bet
            FROM apostatudobetbr.silver.tb_casino_transactions ct
            LEFT JOIN apostatudobetbr.silver.tb_casino_games g ON g.id = ct.game_id
            GROUP BY 1, 2, 3
        ),
        ranked AS (
            SELECT
                jogador_codigo,
                jogo,
                provedor,
                sum_result,
                sum_bet,
                count_bet,
                ROW_NUMBER() OVER (PARTITION BY jogador_codigo ORDER BY sum_result DESC) AS rn_result,
                ROW_NUMBER() OVER (PARTITION BY jogador_codigo ORDER BY sum_bet DESC) AS rn_bet,
                ROW_NUMBER() OVER (PARTITION BY jogador_codigo ORDER BY count_bet DESC) AS rn_spin
            FROM stats
        )
        SELECT
            jogador_codigo,
            MAX(CASE WHEN rn_result = 1 THEN jogo END) AS top_win_1,
            MAX(CASE WHEN rn_result = 2 THEN jogo END) AS top_win_2,
            MAX(CASE WHEN rn_result = 3 THEN jogo END) AS top_win_3,
            MAX(CASE WHEN rn_result = 1 THEN provedor END) AS top_win_provider,
            MAX(CASE WHEN rn_bet = 1 THEN jogo END) AS top_amount_1,
            MAX(CASE WHEN rn_bet = 2 THEN jogo END) AS top_amount_2,
            MAX(CASE WHEN rn_bet = 3 THEN jogo END) AS top_amount_3,
            MAX(CASE WHEN rn_bet = 1 THEN provedor END) AS top_amount_provider,
            MAX(CASE WHEN rn_spin = 1 THEN jogo END) AS top_spin_1,
            MAX(CASE WHEN rn_spin = 2 THEN jogo END) AS top_spin_2,
            MAX(CASE WHEN rn_spin = 3 THEN jogo END) AS top_spin_3,
            MAX(CASE WHEN rn_spin = 1 THEN provedor END) AS top_spin_provider
        FROM ranked
        GROUP BY jogador_codigo
        ORDER BY jogador_codigo
        LIMIT 10
      `;
      
      const results = await this.databricksRepository.executeQuery(query);
      return results;
    } catch (error: any) {
      logger.error('Erro ao testar query de preferências', { 
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async testarNiveisFraude(): Promise<any[]> {
    try {
      logger.info('Testando query de níveis de fraude no Databricks');
      
      const query = `
        WITH users AS (
            SELECT
                id AS user_id,
                name
            FROM apostatudobetbr.silver.tb_users
        ),
        transactions AS (
            SELECT 
                user_id,
                SUM(amount) FILTER (WHERE src = 'deposit_charge') / 100 AS total_deposits,
                SUM(amount) FILTER (WHERE src = 'player_withdraw') / 100 AS total_withdrawals,
                SUM(amount) FILTER (WHERE type = 'debit' AND src = 'casino_transaction') / 100 AS turnover,
                SUM(amount) FILTER (WHERE type = 'credit' AND src = 'casino_transaction') / 100 AS win_amount,
                SUM(amount) FILTER (WHERE type = 'credit' AND src = 'casino_transaction_rollback') / 100 AS total_rollback_credit
            FROM apostatudobetbr.silver.tb_transactions
            WHERE status = 'approved'
            GROUP BY 1
        )
        SELECT
              u.user_id AS codigo,
              LOWER(u.name) AS nome_completo,
              t.turnover AS total_bet,
              t.total_rollback_credit AS total_rollback,
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
        INNER JOIN transactions t ON u.user_id = t.user_id
        LIMIT 10
      `;
      
      const results = await this.databricksRepository.executeQuery(query);
      return results;
    } catch (error: any) {
      logger.error('Erro ao testar query de níveis de fraude', { 
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
}

export default new DatabricksService();
