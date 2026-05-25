package futour.sight.etl.turistas.reader;

import futour.sight.etl.turistas.dto.ChegadaTuristaDTO;
import org.apache.poi.ss.usermodel.*;

import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.List;

public class ExcelReader {

    public List<ChegadaTuristaDTO> ler(String caminho) throws Exception {

        List<ChegadaTuristaDTO> lista = new ArrayList<>();

        try (
                FileInputStream arquivo = new FileInputStream(caminho);
                Workbook workbook = WorkbookFactory.create(arquivo)
        ) {

            Sheet sheet = workbook.getSheetAt(0);

            for (Row row : sheet) {

                if (row.getRowNum() == 0) {
                    continue;
                }

                try {

                    String via = getString(row.getCell(0));
                    String uf = getString(row.getCell(1));
                    String pais = getString(row.getCell(2));
                    String mes = getString(row.getCell(3));

                    Integer ano = getInt(row.getCell(4));
                    Integer chegadas = getInt(row.getCell(5));

                    if (chegadas == null || chegadas == 0) {
                        continue;
                    }

                    lista.add(
                            new ChegadaTuristaDTO(
                                    via,
                                    uf,
                                    pais,
                                    mes,
                                    ano,
                                    chegadas
                            )
                    );

                } catch (Exception e) {

                    System.err.println(
                            "Linha "
                                    + row.getRowNum()
                                    + " ignorada: "
                                    + e.getMessage()
                    );
                }
            }
        }

        return lista;
    }

    private String getString(Cell cell) {

        if (cell == null) {
            return null;
        }

        return switch (cell.getCellType()) {

            case STRING ->
                    cell.getStringCellValue().trim();

            case NUMERIC ->
                    String.valueOf(
                            (int) cell.getNumericCellValue()
                    );

            case BOOLEAN ->
                    String.valueOf(
                            cell.getBooleanCellValue()
                    );

            case FORMULA ->
                    cell.getCellFormula();

            default ->
                    null;
        };
    }

    private Integer getInt(Cell cell) {

        if (cell == null) {
            return null;
        }

        try {

            return switch (cell.getCellType()) {

                case NUMERIC ->
                        (int) cell.getNumericCellValue();

                case STRING ->
                        Integer.parseInt(
                                cell.getStringCellValue().trim()
                        );

                case FORMULA ->
                        (int) cell.getNumericCellValue();

                default ->
                        null;
            };

        } catch (Exception e) {

            return null;
        }
    }
}