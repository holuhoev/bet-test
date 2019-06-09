package ru.holuhoev.bet;

public class BetEvent {

    /* Имя события: Реал М - Барселона*/
    private String name;

    /* Тип ставки: тотал, победа первого, победа второго*/
    private String type;

    /* Коэфициент на ставку*/
    private String coef;

    /* Время, в которое активна ставка*/
    private long   timestamp;

    /* Имя бренда БК */
    private String brand;

    public BetEvent() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCoef() {
        return coef;
    }

    public void setCoef(String coef) {
        this.coef = coef;
    }


    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String toKey() {
        return new StringBuilder()
            .append(name).append(":")
            .append(type).append(":")
            .toString();
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }
}

