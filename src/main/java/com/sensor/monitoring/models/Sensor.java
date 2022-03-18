package com.sensor.monitoring.models;


import javax.persistence.*;

@Entity
@Table(name = "incl")
public class Sensor {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private String factoryId;
    private String version;
    private String port;
    private String address;

    public Sensor() {
    }

    public Sensor(String name, String factoryId, String version, String port, String address) {
        this.name = name;
        this.factoryId = factoryId;
        this.version = version;
        this.port = port;
        this.address = address;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFactoryID() {
        return factoryId;
    }

    public void setFactoryID(String factoryID) {
        this.factoryId = factoryID;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getPort() {
        return port;
    }

    public void setPort(String port) {
        this.port = port;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

}
