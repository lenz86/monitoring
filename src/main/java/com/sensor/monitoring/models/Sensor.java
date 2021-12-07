package com.sensor.monitoring.models;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Sensor {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;
    private int factoryID;
    private String version;
    private int port;
    private int address;

    public Sensor() {
    }

    public Sensor(String name, int factoryID, String version, int port, int address) {
        this.name = name;
        this.factoryID = factoryID;
        this.version = version;
        this.port = port;
        this.address = address;
    }


    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getFactoryID() {
        return factoryID;
    }

    public String getVersion() {
        return version;
    }

    public int getPort() {
        return port;
    }

    public int getAddress() {
        return address;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setFactoryID(int factoryID) {
        this.factoryID = factoryID;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public void setAddress(int address) {
        this.address = address;
    }
}
