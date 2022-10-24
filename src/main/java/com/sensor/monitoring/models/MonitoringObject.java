package com.sensor.monitoring.models;


import javax.persistence.*;

@Entity
@Table(name = "object_info")
public class MonitoringObject {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @Column(name = "object_name")
    private String name;

    @Column(name = "organization_name")
    private String organization;

    @Column(name = "floors_count")
    private String floorsCount;

    @Column(name = "sensors_total")
    private String sensorsCount;

    @Column(name = "incl_count")
    private String inclCount;

    @Column(name = "aksel_count")
    private String akselCount;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "contacts_id")
    private Contact contact;


    public MonitoringObject() {
    }

    public MonitoringObject(String name, String organization, String floorsCount, String sensorsCount, String inclCount, String akselCount, Contact contact) {
        this.name = name;
        this.organization = organization;
        this.floorsCount = floorsCount;
        this.sensorsCount = sensorsCount;
        this.inclCount = inclCount;
        this.akselCount = akselCount;
        this.contact = contact;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOrganization() {
        return organization;
    }

    public void setOrganization(String organization) {
        this.organization = organization;
    }

    public String getFloorsCount() {
        return floorsCount;
    }

    public void setFloorsCount(String floorsCount) {
        this.floorsCount = floorsCount;
    }

    public String getSensorsCount() {
        return sensorsCount;
    }

    public void setSensorsCount(String sensorsCount) {
        this.sensorsCount = sensorsCount;
    }

    public String getInclCount() {
        return inclCount;
    }

    public void setInclCount(String inclCount) {
        this.inclCount = inclCount;
    }

    public String getAkselCount() {
        return akselCount;
    }

    public void setAkselCount(String akselCount) {
        this.akselCount = akselCount;
    }

    public Contact getContact() {
        return contact;
    }

    public void setContact(Contact contact) {
        this.contact = contact;
    }

    @Override
    public String toString() {
        return "MonitoringObject{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", organization='" + organization + '\'' +
                ", floorsCount=" + floorsCount +
                ", sensorsCount=" + sensorsCount +
                ", inclCount=" + inclCount +
                ", akselCount=" + akselCount +
                ", contact=" + contact +
                '}';
    }
}
