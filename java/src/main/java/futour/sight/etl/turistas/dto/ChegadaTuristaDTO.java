package futour.sight.etl.turistas.dto;

public class ChegadaTuristaDTO {

    private String viaDeAcesso;
    private String uf;
    private String pais;
    private String mes;
    private Integer ano;
    private Integer chegadas;

    public ChegadaTuristaDTO(String viaDeAcesso, String uf, String pais,
                             String mes, Integer ano, Integer chegadas) {
        this.viaDeAcesso = viaDeAcesso;
        this.uf = uf;
        this.pais = pais;
        this.mes = mes;
        this.ano = ano;
        this.chegadas = chegadas;
    }

    public String getViaDeAcesso() {
        return viaDeAcesso;
    }
    public String getUf() {
        return uf;
    }
    public String getPais() {
        return pais;
    }
    public String getMes() {
        return mes;
    }
    public Integer getAno() {
        return ano;
    }
    public Integer getChegadas() {
        return chegadas;
    }

}