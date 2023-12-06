# Finestrini
Finestrini je klientská webová aplikace pro rychlé psaní a grafickou organizaci poznámek.

## Funkční specifikace
Uživatel má k dispozici Finestrini workspace, který je ukládán do místního úložiště prohlížeče. Z tohoto vyplývá, že aplikace má pouze jednu uživatelskou roli - Uživatel.
Kromě ukládání do místního úložiště které se děje automaticky po provedených změnách, má uživatel také možnost exportovat si Finestrini workspace do externího souboru a později si ho opět importovat.
Samotný workspace se skládá z tzv. nástěnek, tj. plocha na kterou je možné ukládat své poznámky v podobě barevných lístečků. Nástěnky a lístečky může uživatel libovolně spravovat.
### Grafický návrh
Na obrázcích níže je znázorněn a popsán návrh rozložení Finestrini workspace.
![Finestrini - grafický návrh](./docs/finestrini-graphic-design.png)
![Finestrini - grafický návrh](./docs/finestrini-graphic-design-description.png)
### Use Case
Use Case znázorňuje funkce aplikace Finestrini z pohledu uživatele. <br>
![Use Case diagram aplikace Finestrini](./docs/Finestrini%20UseCase%20diagram.png) <br>
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
Obrázek níže obsahuje datový logický model znázorněný pomocí Entity-relationship modelu zapsaném v Chen-notation. <br>
![Finestrini - datový logický model](./docs/Finestrini%20datový%20logický%20model.png) <br>
