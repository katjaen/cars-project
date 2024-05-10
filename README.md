# Fikcyjna Aplikacja Zakupu Samochodu

Aplikacja została stworzona na potrzeby zadania zaliczeniowego na kierunku studów podyplomowych Programista Front-end z Angular Uniwersytetu WSB Merito we Wrocławiu.

Link do aplikacji: [https://carproject.niklassmolen.pl/](https://carproject.niklassmolen.pl/)

- Na dzień 10 maja 2024 roku aplikacja zawiera błędy związane z nieprawidłowym renderowaniem listy podsumowania i zapisywaniem do local storage. W pliku znajduje sie TODO z rzeczami do zrobienia

## Główne Funkcje

1. **Przeglądanie Dostępnych Samochodów**

   - Użytkownicy mogą przeglądać listę samochodów dostępnych do zakupu wraz z ich parametrami, takimi jak marka, model, rok produkcji, cena itp.
   - Kolor tła kart samochodów jest unikalny dla danej marki.
   - Karty aut mają odpowiednie data-brand data-model itd. umożliwiające łatwe sortowanie w razie potrzeby.
   - Aplikacja jest gotowa na proste przyjęcie kolejnych aut, akcesoriów, miejsc odbioru aut itp. poprzez dodanie ich danych do odpowiednich obiektów w pliku carsData.js.

2. **Wybór Samochodu do Zakupu**

   - Po wyborze samochodu użytkownik może przejść do procesu zakupu, wybierając interesujące go akcesoria dodatkowe.
   - Akcesoria w aplikacji są dwojakiego rodzaju - wspólne dla wszystkich aut i indywidualne dla danego modelu.

3. **Zarządzanie Zamówieniem**

   - Użytkownik może zarządzać swoim zamówieniem, dodając i usuwając akcesoria, a także przeglądając podsumowanie zamówienia przed finalnym potwierdzeniem.
   - Dane użytkownika zapisywane są w pamięci lokalnej, aby nie utracił do nich dostępu w przypadku zmiany decyzji lub braku potwierdzenia zamówienia, a następnie powrotu do zamówienia.
   - Dane użytkownika i dane zamowienia dotyczące jego wyborów akcesoriów dla konkretnego auta zapisywane są w pamięci lokalnej, aby użytkownik nie utracił do nich dostępu w przypadku zmiany decyzji lub braku potwierdzenia zamówienia, a następnie powrócił do zamówienia.

4. **Podsumowanie Zamówienia**

   - Po złożeniu zamówienia użytkownik może zobaczyć podsumowanie zamówienia, w tym wybrane samochody, akcesoria oraz ostateczną cenę.

5. **Potwierdzenie Zakupu**

   - Po przeglądzie podsumowania zamówienia użytkownik może potwierdzić swoje zamówienie, podając swoje dane osobowe, adres dostawy oraz metodę płatności.

6. **Powrót do Strony Głównej**
   - Użytkownik może w dowolnym momencie wrócić do strony głównej, aby przeglądać dostępne samochody lub składać nowe zamówienie. Powrót umożliwia przycisk powrotu lub kliknięcie na logo.

**UWAGA!**
W aplikacji użyto zdjęć ze strony lego.com – wszelkie prawa autorskie do tych zdjęć posiada firma lego, w tej aplikacji użytek jest wyłącznie na cel edukacyjny.

#Fictional Car Buying App

The application was created for the purpose of a final assignment for the postgraduate studies Front-end Developer with Angular at the WSB Merito University in Wrocław.

Link to the application: [https://carproject.niklassmolen.pl/](https://carproject.niklassmolen.pl/)

## Main Features

1. **Browse Available Cars**

   - Users can view the list of cars available for purchase along with their parameters such as make, model, year of production, price, etc.
   - The background color of car cards is unique to a given brand.
   - Car cards have appropriate data-brand data-model etc. enabling easy sorting if necessary.
   - The application is ready to easily accept additional cars, accessories, car pickup locations, etc. by adding their data to the appropriate objects in the carsData.js file.

2. **Selecting a Car for Purchase**

   - After selecting a car, the user can proceed to the purchase process by selecting the additional accessories that interest him.
   - Accessories in the application are of two types - shared for all cars and individual for a given model.

3. **Order Management**

   - The user can manage his order by adding and removing accessories, as well as viewing the order summary before final confirmation.
   - User data is saved in local memory so that he does not lose access to them if he changes his mind or does not confirm the order and then returns to the order.
   - User data and order data regarding the selection of accessories for a specific car are saved in local memory so that the user does not lose access to them if he changes his mind or does not confirm the order, and then returns to the order.

4. **Order Summary**

   - After placing the order, the user can see a summary of the order, including selected cars, accessories and the final price.

5. **Confirmation of Purchase**

   - After viewing the order summary, you can confirm your order by providing your personal details, delivery address and payment method.

6. **Back to Home Page**
   - The user can return to the home page at any time to browse available cars or place a new order. You can return by pressing the return button or clicking on the logo.

**ATTENTION!**
The application uses photos from lego.com - all copyrights to these photos are held by the lego company, in this application they are used for educational purposes only.
