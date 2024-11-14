import { Injectable } from '@angular/core';
import * as L from 'leaflet';
@Injectable({
  providedIn: 'root'
})
export class CoordsService {

  private control: any;

  constructor() { }

  createControl(options?: any): L.Control {
    const defaultOptions = {
      position: 'bottomleft',
      latitudeText: 'lat.',
      longitudeText: 'lon.',
      promptText: 'Press Ctrl+C to copy coordinates',
      precision: 4,
      ...options
    };

    this.control = L.Control.extend({
      options: defaultOptions,

      onAdd: (map: L.Map) => {
        const className = 'leaflet-control-coordinates';
        const container = L.DomUtil.create('div', className);
        L.DomUtil.addClass(container, 'hidden');

        L.DomEvent.disableClickPropagation(container);
        this.addText(container);

        L.DomEvent.on(container, 'click', () => {
          const latText = L.DomUtil.get(this.control._lat)?.textContent ?? '';
          const lngText = L.DomUtil.get(this.control._lng)?.textContent ?? '';

          const latCoordinate = latText.substring(latText.indexOf(this.options.latitudeText) + this.options.latitudeText.length + 1);
          const lngCoordinate = lngText.substring(lngText.indexOf(this.options.longitudeText) + this.options.longitudeText.length + 1);

          window.prompt(this.options.promptText, `${latCoordinate} ${lngCoordinate}`);
        });

        return container;
      },

      addText: (container: HTMLElement) => {
        this.control._lat = L.DomUtil.create('span', 'leaflet-control-coordinates-lat', container);
        this.control._lng = L.DomUtil.create('span', 'leaflet-control-coordinates-lng', container);
      },

      setCoordinates: (obj: any) => {
        if (!L.DomUtil.hasClass(this.control._container, 'hidden')) {
          L.DomUtil.removeClass(this.control._container, 'hidden');
        }

        if (obj.latlng) {
          L.DomUtil.get(this.control._lat).innerHTML = `<strong>${this.options.latitudeText}:</strong> ${obj.latlng.lat.toFixed(this.options.precision)}`;
          L.DomUtil.get(this.control._lng).innerHTML = `<strong>${this.options.longitudeText}:</strong> ${obj.latlng.lng.toFixed(this.options.precision)}`;
        }
      }
    });

    return new this.control();
  }
}
