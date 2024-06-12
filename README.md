## Spis Treści / Contents

1. [Fikcyjna Aplikacja Zakupu Samochodu](#fikcyjna-aplikacja-zakupu-samochodu)

   1. [Główne Funkcje](#główne-funkcje)
      - [Przeglądanie Dostępnych Samochodów](#przeglądanie-dostępnych-samochodów)
      - [Wybór Samochodu do Zamówienia](#wybór-samochodu-do-zamówienia)
      - [Zarządzanie Zamówieniem](#zarządzanie-zamówieniem)
      - [Podsumowanie Zamówienia](#podsumowanie-zamówienia)
      - [Potwierdzenie Zamówienia](#potwierdzenie-zamówienia)
      - [Powrót do Strony Głównej](#powrót-do-strony-głównej)

2. [Application for Buying a Fictitious Car](#application-for-buying-a-fictitious-car)
   1. [Main Functions](#main-functions)
      - [Browsing Available Cars](#browsing-available-cars)
      - [Selecting a Car to Order](#selecting-a-car-to-order)
      - [Order Management](#order-management)
      - [Order Summary](#order-summary)
      - [Order Confirmation](#order-confirmation)
      - [Back to Home](#back-to-home)

### Fikcyjna Aplikacja Zakupu Samochodu

Aplikacja została stworzona na potrzeby zadania zaliczeniowego na kierunku studiów podyplomowych 2023/2024, kierunek: Programista Front-end z Angular, Uniwersytet WSB Merito we Wrocławiu.

Link do aplikacji: [https://carproject.niklassmolen.pl/](https://carproject.niklassmolen.pl/)

Aplikacja jest w pełni responsywna.

### Główne Funkcje

#### Przeglądanie Dostępnych Samochodów

- Użytkownicy mogą przeglądać listę dostępnych samochodów z ich parametrami (marka, model, rok produkcji, cena itd.).
- Tło kart samochodów jest unikalne dla każdej marki.
- Dodano możliwość sortowania według marki samochodu.
- Karty samochodów wyposażono w atrybuty `data-brand`, `data-model` itd., umożliwiające dodanie sortowania również po innych właściwościach.
- Aplikacja umożliwia łatwe dodawanie nowych samochodów, akcesoriów i lokalizacji odbioru poprzez aktualizację pliku `carsData.js`.
- Samochody są walidowane i jeśli np. jest nieprawidłowy format ceny – nie wyświetlą się, a wyświetli się ostrzeżenie w konsoli [zademonstrowano na przykładzie].

#### Wybór Samochodu do Zamówienia

- Po wyborze samochodu użytkownik może przejść do zamawiania, wybierając dodatkowe akcesoria.
- Akcesoria są wspólne dla wszystkich samochodów lub indywidualne dla danego modelu, przy czym jedno z akcesoriów pozwala na wybór indywidualnego koloru.

#### Zarządzanie Zamówieniem

- Użytkownik może zarządzać zamówieniem, dodając i usuwając akcesoria oraz przeglądając podsumowanie przed finalnym potwierdzeniem.
- Dane użytkownika są zapisywane w pamięci lokalnej, aby nie zostały utracone w przypadku opuszczenia strony lub jej przeładowania.
- Rozpoczęte zamówienia są zapisywane w pamięci lokalnej, aby można było do nich wrócić później.
- Pamięć lokalna jest czyszczona po złożeniu zamówienia.

#### Podsumowanie Zamówienia

- Przed złożeniem zamówienia użytkownik widzi podsumowanie zamówienia z wybranym samochodem, akcesoriami i ostateczną ceną.

#### Potwierdzenie Zamówienia

- Po przeglądzie podsumowania użytkownik może potwierdzić zamówienie. Formularz jest walidowany i wyświetla komunikaty o brakujących danych.
- W określonych przypadkach po potwierdzeniu zamówienia wyświetlane są dodatkowe informacje specjalne.

#### Powrót do Strony Głównej

- Poprzez kliknięcie na logo lub przycisk powrotu użytkownik może w dowolnym momencie wrócić do strony głównej.

**UWAGA:** W aplikacji użyto zdjęć ze strony lego.com – wszelkie prawa autorskie do tych zdjęć posiada firma LEGO. Użytek tych zdjęć jest wyłącznie na cel edukacyjny.

---

### Application for buying a fictitious car

The application was created for the purpose of completing postgraduate studies 2023/2024, major: Front-end Developer with Angular, Merito Banking University in Wrocław.

Link to the application: [https://carproject.niklassmolen.pl/](https://carproject.niklassmolen.pl/)

The application is fully responsive.

### Main Functions

#### Browsing Available Cars

- Users can browse the list of available cars with their parameters (make, model, year of production, price, etc.).
- The background of car cards is unique for each brand.
- The ability to sort by car brand has been added.
- Car cards have been equipped with attributes `data-brand`, `data-model`, etc., which allows sorting by other properties as well.
- The application allows easy addition of new cars, accessories, and pick-up locations by updating the `carsData.js` file.
- Cars are validated, and if, for example, the price format is incorrect - they will not be displayed, and a warning will be shown in the console [demonstrated with an example].

#### Selecting a Car to Order

- After selecting a car, the user can proceed to order by selecting additional accessories.
- Accessories are common to all cars or individual for a given model, with one of the accessories allowing the selection of an individual color.

#### Order Management

- The user can manage the order by adding and removing accessories and viewing the summary before final confirmation.
- User data is saved in local storage so that it is not lost in case of leaving or reloading the page.
- Orders that have been started are saved in local storage so they can be returned to later.
- Local storage is cleared after the order is placed.

#### Order Summary

- Before placing the order, the user sees a summary with the selected car, accessories, and the final price.

#### Order Confirmation

- After reviewing the summary, the user can confirm the order. The form is validated and displays messages about missing data.
- In some cases, additional special information is displayed after order confirmation.

#### Back to Home

- By clicking on the logo or the Back button, the user can return to the home page at any time.

**NOTE:** The application uses photos from lego.com - all copyrights to these photos belong to LEGO. The use of these photos is for educational purposes only.

---
