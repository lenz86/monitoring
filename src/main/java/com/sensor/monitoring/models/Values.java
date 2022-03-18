package com.sensor.monitoring.models;


import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "incl_values")
public class Values {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private Long sensorId;
    private String axisX;
    private String axisY;
    private java.sql.Timestamp date;

    public Values() {
    }

    public Values(Long sensorId, String axisX, String axisY, Timestamp date) {
        this.sensorId = sensorId;
        this.axisX = axisX;
        this.axisY = axisY;
        this.date = date;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSensorId() {
        return sensorId;
    }

    public void setSensorId(Long sensorId) {
        this.sensorId = sensorId;
    }

    public String getAxisX() {
        return axisX;
    }

    public void setAxisX(String axisX) {
        this.axisX = axisX;
    }

    public String getAxisY() {
        return axisY;
    }

    public void setAxisY(String axisY) {
        this.axisY = axisY;
    }

    public Timestamp getDate() {
        return date;
    }

    public void setDate(Timestamp date) {
        this.date = date;
    }
}
