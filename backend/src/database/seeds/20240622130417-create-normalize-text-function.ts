import { QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    // Criação da função SQL normalize_text
    await queryInterface.sequelize.query(`
      CREATE FUNCTION normalize_text(str VARCHAR(255)) RETURNS VARCHAR(255) DETERMINISTIC
      BEGIN
          SET str = LOWER(str);
          SET str = REPLACE(str, 'á', 'a');
          SET str = REPLACE(str, 'à', 'a');
          SET str = REPLACE(str, 'â', 'a');
          SET str = REPLACE(str, 'ã', 'a');
          SET str = REPLACE(str, 'ä', 'a');
          SET str = REPLACE(str, 'é', 'e');
          SET str = REPLACE(str, 'è', 'e');
          SET str = REPLACE(str, 'ê', 'e');
          SET str = REPLACE(str, 'ë', 'e');
          SET str = REPLACE(str, 'í', 'i');
          SET str = REPLACE(str, 'ì', 'i');
          SET str = REPLACE(str, 'î', 'i');
          SET str = REPLACE(str, 'ï', 'i');
          SET str = REPLACE(str, 'ó', 'o');
          SET str = REPLACE(str, 'ò', 'o');
          SET str = REPLACE(str, 'ô', 'o');
          SET str = REPLACE(str, 'õ', 'o');
          SET str = REPLACE(str, 'ö', 'o');
          SET str = REPLACE(str, 'ú', 'u');
          SET str = REPLACE(str, 'ù', 'u');
          SET str = REPLACE(str, 'û', 'u');
          SET str = REPLACE(str, 'ü', 'u');
          SET str = REPLACE(str, 'ç', 'c');
          SET str = REPLACE(str, 'ñ', 'n');
          SET str = REPLACE(str, '-', '');
          RETURN str;
      END;
    `);
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    // Exclusão da função SQL normalize_text
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS normalize_text;
    `);
  }
};
