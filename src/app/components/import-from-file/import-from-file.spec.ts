import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportFromFile } from './import-from-file';

describe('ImportFromFile', () => {
  let component: ImportFromFile;
  let fixture: ComponentFixture<ImportFromFile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportFromFile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportFromFile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('zoneless file read', () => {

    beforeEach(async () => {
      await TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
        imports: [ImportFromFile]
      })
      .compileComponents();

      fixture = TestBed.createComponent(ImportFromFile);
      component = fixture.componentInstance;
    });

    it('renders the parsed result as soon as the file read completes, without any further click', async () => {
      const xml = [
        '<dogs>',
        '  <dog>',
        '    <dogid>1</dogid>',
        '    <dogname>Kyla</dogname>',
        '    <breed>Cocker spaniel</breed>',
        '    <mappedOwner>4</mappedOwner>',
        '    <dogPhotos></dogPhotos>',
        '    <appointments><appointment><apptDate>2025-12-23</apptDate><price>10</price></appointment></appointments>',
        '  </dog>',
        '</dogs>'
      ].join('\n');

      const originalFileReader = globalThis.FileReader;
      class FakeFileReader {
        onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown) | null = null;
        onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown) | null = null;
        result: string | ArrayBuffer | null = null;

        readAsText(_file: Blob) {
          this.result = xml;
          setTimeout(() => {
            this.onload?.call(this as unknown as FileReader, new ProgressEvent('load') as ProgressEvent<FileReader>);
          }, 0);
        }
      }
      globalThis.FileReader = FakeFileReader as unknown as typeof FileReader;

      try {
        const file = { name: 'dogs.xml', size: 123 } as File;
        const input = { files: [file], value: 'dogs.xml' } as unknown as HTMLInputElement;
        component.onFileSelected({ target: input } as unknown as Event);

        // No interaction after the selected file: zoneless change detection
        // must drive the update from the FileReader.onload callback alone.
        await new Promise((resolve) => setTimeout(resolve, 50));

        const nativeElement = fixture.nativeElement as HTMLElement;
        const rows = nativeElement.querySelectorAll('tbody tr');
        expect(rows.length).toBe(1);
        expect(rows[0]?.textContent).toContain('Kyla');
      } finally {
        globalThis.FileReader = originalFileReader;
      }
    });
  });
});
