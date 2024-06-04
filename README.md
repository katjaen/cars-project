```markdown
### Fikcyjna Aplikacja Zakupu Samochodu

Aplikacja została stworzona na potrzeby zadania zaliczeniowego na kierunku studiów podyplomowych Programista Front-end z Angular Uniwersytetu WSB Merito we Wrocławiu.

Link do aplikacji: [https://carproject.niklassmolen.pl/](https://carproject.niklassmolen.pl/)

Aplikacja jest w pełni responsywna.

**UWAGA:** Na dzień 4 czerwca 2024 roku istnieje problem z akcesoriami wyposażonymi w input typu kolor. Kolor można zmieniać, ale zmiana nie odzwierciedla się w zamówieniu bez wcześniejszego kliknięcia przycisku. Aby zmiana koloru była widoczna w zamówieniu, należy usunąć akcesorium i dodać je ponownie z nowym kolorem.

## Główne Funkcje

1. **Przeglądanie Dostępnych Samochodów**

   - Użytkownicy mogą przeglądać listę dostępnych samochodów z ich parametrami (marka, model, rok produkcji, cena itd.).
   - Tło kart samochodów jest unikalne dla każdej marki.
   - Możliwość sortowania według marki samochodu.
   - Karty samochodów zawierają atrybuty `data-brand`, `data-model` itp., umożliwiające łatwe sortowanie.
   - Aplikacja umożliwia łatwe dodawanie nowych samochodów, akcesoriów i lokalizacji odbioru poprzez aktualizację pliku `carsData.js`.

2. **Wybór Samochodu do Zamówienia**

   - Po wyborze samochodu użytkownik może przejść do zamawiania, wybierając dodatkowe akcesoria.
   - Akcesoria mogą być wspólne dla wszystkich samochodów lub indywidualne dla danego modelu.

3. **Zarządzanie Zamówieniem**

   - Użytkownik może zarządzać swoim zamówieniem, dodając i usuwając akcesoria oraz przeglądając podsumowanie zamówienia przed finalnym potwierdzeniem.
   - Dane użytkownika są zapisywane w pamięci lokalnej, aby nie zostały utracone w przypadku opuszczenia zamówienia lub przeładowania strony.
   - Rozpoczęte zamówienia samochodów również są zapisywane w pamięci lokalnej, aby można było do nich wrócić później.
   - Pamięć lokalna jest czyszczona po złożeniu zamówienia.

4. **Podsumowanie Zamówienia**

   - Przed złożeniem zamówienia użytkownik widzi podsumowanie zamówienia, które zawiera wybrane samochody, akcesoria i ostateczną cenę.

5. **Potwierdzenie Zamówienia**

   - Po przeglądzie podsumowania zamówienia użytkownik może potwierdzić swoje zamówienie. Formularz jest walidowany i wyświetla komunikaty o brakujących danych.

6. **Powrót do Strony Głównej**
   - Użytkownik może w dowolnym momencie wrócić do strony głównej, aby przeglądać dostępne samochody lub składać nowe zamówienie. Powrót umożliwia przycisk lub kliknięcie na logo.

**UWAGA:** W aplikacji użyto zdjęć ze strony lego.com – wszelkie prawa autorskie do tych zdjęć posiada firma LEGO. Użytek tych zdjęć jest wyłącznie na cel edukacyjny.

---

### Fictitious Car Purchase Application

The application was created for a credit assignment for the postgraduate studies "Front-end Developer with Angular" at WSB Merito University in Wrocław.

Link to the application: [https://carproject.niklassmolen.pl/](https://carproject.niklassmolen.pl/)

The application is fully responsive.

**NOTE:** As of June 4, 2024, there is an issue with accessories featuring a color input. The color can be changed, but it is not reflected in the order without first clicking the button. To update the color in the order, you need to remove the accessory and add it again with the new color.

## Main Features

1. **Browsing Available Cars**

   - Users can browse the list of available cars with their parameters (make, model, year of production, price, etc.).
   - The background color of car cards is unique to each brand.
   - Sorting by car brand is possible.
   - Car cards have `data-brand`, `data-model`, etc., attributes allowing easy sorting.
   - The application is ready to accept new cars, accessories, and collection locations by updating the `carsData.js` file.

2. **Selecting a Car to Order**

   - After selecting a car, the user can proceed to ordering, choosing additional accessories.
   - Accessories can be common to all cars or individual to a specific model.

3. **Order Management**

   - Users can manage their orders by adding and removing accessories and viewing the order summary before final confirmation.
   - User data is saved in local storage to prevent data loss in case of temporary abandonment or page reload.
   - Started car orders are also saved in local storage to allow users to return to their abandoned orders.
   - Local storage is cleared after the order is placed.

4. **Order Summary**

   - Before placing an order, the user sees a summary, including the selected cars, accessories, and the final price.

5. **Order Confirmation**

   - After reviewing the order summary, the user can confirm the order. The form is validated and displays messages about any missing data.

6. **Return to the Home Page**
   - The user can return to the home page at any time to view available cars or place a new order. The return is possible using the back button or clicking on the logo.

**NOTE:** The application uses photos from lego.com - all copyrights to these photos belong to LEGO. In this application, they are used for educational purposes only.
```
