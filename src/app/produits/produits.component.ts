import { Component, OnInit } from '@angular/core';
import { Produit } from '../model/produit';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProduitsService } from '../services/produits.service';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit {
  produits: Array<Produit> = [];
  produitCourant: Produit = new Produit();

  constructor(private produitsService: ProduitsService, private http: HttpClient) {}

  ngOnInit(): void {
    console.log("Initializing component: Retrieving the list of products");
    this.consulterProduits();
  }

  consulterProduits() {
    console.log("Retrieving the list of products");
    this.produitsService.getProduits().subscribe({
      next: data => {
        console.log("GET Success");
        this.produits = data;
      },
      error: err => {
        console.error("GET Error", err);
      }
    });
  }

 mettreAJourProduit(nouveau: Produit, ancien: Produit) {
  const confirmation = confirm(`Existing product. Confirm updating: ${ancien.designation}?`);

  if (confirmation) {
    this.produitsService.updateProduit(ancien.id, nouveau).subscribe({
      next: updatedProduit => {
        console.log("PUT Success");
        Object.assign(ancien, updatedProduit);  // Use updatedProduit directly if it's an individual product
        console.log('Product updated: ' + ancien.designation);
      },
      error: err => {
        console.error("PUT Error", err);
      }
    });
  } else {
    console.log("Update canceled");
  }
}


  ajouterProduit(nouveau: Produit) {
    console.log('New product');
    this.produitsService.addProduit(nouveau).subscribe({
      next: newProduct => {
        console.log("POST Success");
        this.produits.push(nouveau);
      },
      error: err => {
        console.error("POST Error", err);
      }
    });
  }

  supprimerProduit(produit: Produit) {
    const reponse: boolean = confirm(`Do you want to delete the product: ${produit.designation}?`);

    if (reponse) {
      console.log("Deletion confirmed...");

      this.produitsService.deleteProduit(produit.id).subscribe({
        next: () => {
          console.log("DELETE Success");
          const index: number = this.produits.indexOf(produit);

          console.log("Index of the product to delete: " + index);

          if (index !== -1) {
            this.produits.splice(index, 1);
          }
        },
        error: err => {
          console.error("DELETE Error", err);
        }
      });
    } else {
      console.log("Deletion canceled...");
    }
  }

  validerFormulaire(form: NgForm) {
    console.log(form.value);

    if (form.value.id !== undefined) {
      console.log("Non-empty id...");
      const existingProduct = this.produits.find(p => p.id === form.value.id);

      if (existingProduct) {
        console.log('Existing product');
        this.mettreAJourProduit(form.value, existingProduct);
      } else {
        console.log('New product');
        this.ajouterProduit(form.value);
        console.log("Adding a new product: " + form.value.designation);
      }
    } else {
      console.log("Empty ID...");
    }
  }

  annulerSaisie() {
    this.produitCourant = new Produit();
  }

  editerProduit(p: Produit) {
    this.produitCourant = p;
  }
}
