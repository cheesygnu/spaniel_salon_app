import { Component, computed, signal } from '@angular/core';
import { Dog } from '../../models/dog.model';
import { DogOwner } from '../../models/dog-owner.model';
import { ParseXMLImport, XMLFileType } from '../../services/parse-xml-import';
import { DogsWithOwner } from '../../models/dogs-with-owners.model';

@Component({
  selector: 'app-import-from-file',
  imports: [],
  templateUrl: './import-from-file.html',
  styleUrl: './import-from-file.css',
})
export class ImportFromFile {

  // State is held in signals (this app uses provideZonelessChangeDetection),
  // so writes from async callbacks such as FileReader.onload still schedule a
  // re-render without requiring any additional user interaction.
  selectedFile = signal('');
  fileSizeBytes = signal(0);
  parsedDogs = signal<Dog[]>([]);
  parsedOwners = signal<DogOwner[]>([]);
  parsedDogsWithOwners = signal<DogsWithOwner[]>([]);
  parseSuccessful = signal(false);
  parseError = signal<string | null>(null);
  parseXMLFileType = signal(XMLFileType.Unrecognised);

  fileSizeLabel = computed(() => {
    const size = this.fileSizeBytes();
    if (size === 0) return '';
    if (size < 1024) return `${size} B`;
    return `${(size / 1024).toFixed(1)} KB`;
  });

  /*totalAppointments = computed(() =>
    this.parsedDogs().reduce(
      (total, dog) => total + dog.appointments.length,
      0
    )
  );*/

  constructor(private parseXMLImport: ParseXMLImport) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    this.selectedFile.set(file.name);
    this.fileSizeBytes.set(file.size);
    this.parsedDogs.set([]);
    this.parsedOwners.set([]);
    this.parsedDogsWithOwners.set([]);
    this.parseSuccessful.set(false);
    this.parseError.set(null);
    this.parseXMLFileType.set(XMLFileType.Unrecognised);

    const reader = new FileReader();
    reader.onload = () => {
      const xmlString = String(reader.result ?? '');
      try {
        this.parseXMLFileType.set(this.parseXMLImport.parse(xmlString).type);
        this.parsedDogs.set(this.parseXMLImport.parse(xmlString).dogs);
        this.parsedOwners.set(this.parseXMLImport.parse(xmlString).owners);
        this.parsedDogsWithOwners.set(this.parseXMLImport.parse(xmlString).dogsWithOwners);
        this.parseSuccessful.set(true);
      } catch (error) {
        this.parseError.set(
          error instanceof Error ? error.message : 'Could not parse the file.'
        );
      }
      input.value = ''; // allows the same file to be selected again
    };
    reader.onerror = () => {
      this.parseError.set('Could not read the file.');
      input.value = '';
    };
    reader.readAsText(file);
  }
}
