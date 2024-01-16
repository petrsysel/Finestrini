# Finestrini
Finestrini je klientská webová aplikace pro rychlé psaní a grafickou organizaci poznámek.
Aplikaci naleznete [zde](https://kraken.pedf.cuni.cz/~syselpet/finestrini/).

## Funkční specifikace
Uživatel má k dispozici Finestrini workspace, který je ukládán do místního úložiště prohlížeče. Z tohoto vyplývá, že aplikace má pouze jednu uživatelskou roli - Uživatel.


Kromě ukládání do místního úložiště které se děje automaticky po provedených změnách, má uživatel také možnost exportovat si Finestrini workspace do externího souboru a později si ho opět importovat.


Samotný workspace se skládá z tzv. nástěnek, tj. plocha na kterou je možné ukládat své poznámky v podobě barevných lístečků. Nástěnky a lístečky může uživatel libovolně spravovat.


### Grafický návrh
Na obrázcích níže je znázorněn a popsán návrh rozložení Finestrini workspace.


![Finestrini - grafický návrh](./docs/finestrini-graphic-design.png)
![Finestrini - grafický návrh](./docs/finestrini-graphic-design-description.png)


### Use Case
Use Case znázorňuje funkce aplikace Finestrini z pohledu uživatele.


![Use Case diagram aplikace Finestrini](./docs/Finestrini%20UseCase%20diagram.png)


Bližší pohled na jednotlivé use case nabízí Use Case specifikace níže (či v [PDF](./docs/Finestrini%20UseCase%20specification.pdf) a [Excel](./docs/Finestrini%20UseCase.xlsx)).


![Finestrini Use Case UC1](./docs/Finestrini%20UC1.png)
![Finestrini Use Case UC2](./docs/Finestrini%20UC2.png)
![Finestrini Use Case UC3](./docs/Finestrini%20UC3.png)
![Finestrini Use Case UC4](./docs/Finestrini%20UC4.png)
![Finestrini Use Case UC5](./docs/Finestrini%20UC5.png)
![Finestrini Use Case UC6](./docs/Finestrini%20UC6.png)
![Finestrini Use Case UC7](./docs/Finestrini%20UC7.png)
![Finestrini Use Case UC8](./docs/Finestrini%20UC8.png)
![Finestrini Use Case UC9](./docs/Finestrini%20UC9.png)

## Technická specifikace

### Datový logický model
Obrázek níže obsahuje datový logický model znázorněný pomocí Entity-relationship modelu zapsaném v Chen-notation.


![Finestrini - datový logický model](./docs/Finestrini%20datový%20logický%20model.png)


### Popis architektury
Aplikace je postavena na [Hexagonální architektuře](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)) také známé jako Ports & Adapters. Class diagram aplikace ukazuje její strukturu: <br>
![Finestrini class diagram](./docs/Finestrini%20Class%20Diagram.png)


Jádro aplikace tvoří třídy App a Workspace. Workspace obsahuje veškeré informace o nástěnkách a lístečkách a metody pro práci s nimi. App je hlavní třída aplikace, která řídí tok dat. Vše co aplikace ke svému běhu potřebuje je jí poskytnuto skrze porty (interfacy). Konkrétní implementace jsou aplikaci poskytnuty zvenčí při vytváření její instance.

Tento přístup zvyšuje přehlednost, testovatelnost a umožňuje snadnou výměnu kteréhokoliv adaptéru. Konkrétně v této aplikaci by to mohlo znamenat snadný přechod z grafické knihovny Konva na jinou knihovnu (například p5.js) jen sepsáním nového p5 adaptéru a jeho výměnou. 


Použité adaptéry a jejich technologie:
- ControlPanelUI - vykresluje ovládací panel a jeho prvky na kterých odchytává události (například kliknutí na tlačítko).
- ConfirmDialogueUI - zajišťuje zobrazení dialogového okna s tlačítky ano/ne.
- InputDialogueUI - Zobrazuje dialogové okno pro textový vstup od uživatele (například při vyplňování jména nástěnky).
- ColorDialogue - Zobrazuje dialohové okno pro výběr barvy.
- TinyMCEDialogueUI - Zobrazuje dialogové okno s "rich text" editorem TinyMCE (pro zadávání obsahu lístečků).
- KonvaBoardUI - Pomocí grafické knihovny Konva zprostředkovává zobrazování nástěnky a odchytává své události (například kliknutí na lísteček).
- LocalStorageRepository - Implementuje ukládání a načítání workspace z a do lokálního úložiště prohlížeče.
- ExternalRepository - Ukládá a načítá workspace do souborového systému uživatele (stažení a nahrání).